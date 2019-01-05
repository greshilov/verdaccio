/**
 * @prettier
 * @flow
 */

import React, { Component } from 'react';
import type { Node } from 'react';

import Button from '@material-ui/core/Button/index';
import IconButton from '@material-ui/core/IconButton/index';
import MenuItem from '@material-ui/core/MenuItem/index';
import Menu from '@material-ui/core/Menu/index';
import Info from '@material-ui/icons/Info';
import Help from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip/index';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { default as IconSearch } from '@material-ui/icons/Search';

import { getRegistryURL } from '../../utils/url';
import Link from '../Link';
import Logo from '../Logo';
import CopyToClipBoard from '../CopyToClipBoard/index';
import RegistryInfoDialog from '../RegistryInfoDialog';
import Label from '../Label';
import Search from '../Search';

import { IProps, IState } from './types';
import { Greetings, NavBar, InnerNavBar, MobileNavBar, InnerMobileNavBar, LeftSide, RightSide, IconSearchButton, SearchWrapper } from './styles';

class Header extends Component<IProps, IState> {
  handleLoggedInMenu: Function;
  handleLoggedInMenuClose: Function;
  handleOpenRegistryInfoDialog: Function;
  handleCloseRegistryInfoDialog: Function;
  handleToggleLogin: Function;
  renderInfoDialog: Function;

  constructor(props: IProps) {
    super(props);
    this.state = {
      openInfoDialog: false,
      registryUrl: '',
      showMobileNavBar: false,
    };
  }

  componentDidMount() {
    const registryUrl = getRegistryURL();
    this.setState({
      registryUrl,
    });
  }

  /**
   * opens popover menu for logged in user.
   */
  handleLoggedInMenu = (event: SyntheticEvent<HTMLElement>) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  /**
   * closes popover menu for logged in user
   */
  handleLoggedInMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  /**
   * opens registry information dialog.
   */
  handleOpenRegistryInfoDialog = () => {
    this.setState({
      openInfoDialog: true,
    });
  };

  /**
   * closes registry information dialog.
   */
  handleCloseRegistryInfoDialog = () => {
    this.setState({
      openInfoDialog: false,
    });
  };

  /**
   * close/open popover menu for logged in users.
   */
  handleToggleLogin = () => {
    const { onToggleLoginModal } = this.props;
    this.setState(
      {
        anchorEl: null,
      },
      onToggleLoginModal
    );
  };

  handleToggleMNav = () => {
    const { showMobileNavBar } = this.state;
    this.setState({
      showMobileNavBar: !showMobileNavBar,
    });
  };

  handleDismissMNav = () => {
    this.setState({
      showMobileNavBar: false,
    });
  };

  renderLeftSide = (): Node => {
    const { withoutSearch = false } = this.props;
    return (
      <LeftSide>
        <Link style={{ marginRight: '1em' }} to={'/'}>
          <Logo />
        </Link>
        {!withoutSearch && (
          <SearchWrapper>
            <Search />
          </SearchWrapper>
        )}
      </LeftSide>
    );
  };

  renderRightSide = (): Node => {
    const { username = '', withoutSearch = false } = this.props;
    const installationLink = 'https://verdaccio.org/docs/en/installation';
    return (
      <RightSide>
        {!withoutSearch && (
          <Tooltip disableFocusListener={true} title={'Search packages'}>
            <IconSearchButton color={'inherit'} onClick={this.handleToggleMNav}>
              <IconSearch />
            </IconSearchButton>
          </Tooltip>
        )}
        <Tooltip disableFocusListener={true} title={'Documentation'}>
          <IconButton blank={true} color={'inherit'} component={Link} to={installationLink}>
            <Help />
          </IconButton>
        </Tooltip>
        <Tooltip disableFocusListener={true} title={'Registry Information'}>
          <IconButton color={'inherit'} id={'header--button-registryInfo'} onClick={this.handleOpenRegistryInfoDialog}>
            <Info />
          </IconButton>
        </Tooltip>
        {username ? (
          this.renderMenu()
        ) : (
          <Button color={'inherit'} id={'header--button-login'} onClick={this.handleToggleLogin}>
            Login
          </Button>
        )}
      </RightSide>
    );
  };

  /**
   * render popover menu
   */
  renderMenu = (): Node => {
    const { onLogout, username = '' } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <React.Fragment>
        <IconButton color={'inherit'} id={'header--button-account'} onClick={this.handleLoggedInMenu}>
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          id={'sidebar-menu'}
          onClose={this.handleLoggedInMenuClose}
          open={open}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}>
          <MenuItem disabled={true}>
            <Greetings>{`Hi,`}</Greetings>
            <Label capitalize={true} limit={140} text={username} weight={'bold'} />
          </MenuItem>
          <MenuItem id={'header--button-logout'} onClick={onLogout}>
            Logout
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  };

  renderInfoDialog = (): Node => {
    const { scope } = this.props;
    const { openInfoDialog, registryUrl } = this.state;
    return (
      <RegistryInfoDialog onClose={this.handleCloseRegistryInfoDialog} open={openInfoDialog}>
        <div>
          <CopyToClipBoard text={`npm set ${scope} registry ${registryUrl}`} />
          <CopyToClipBoard text={`npm adduser --registry ${registryUrl}`} />
        </div>
      </RegistryInfoDialog>
    );
  };

  render() {
    const { showMobileNavBar } = this.state;
    const { withoutSearch = false } = this.props;
    return (
      <div>
        <NavBar position={'static'}>
          <InnerNavBar>
            {this.renderLeftSide()}
            {this.renderRightSide()}
          </InnerNavBar>
          {this.renderInfoDialog()}
        </NavBar>
        {showMobileNavBar &&
          !withoutSearch && (
            <MobileNavBar>
              <InnerMobileNavBar>
                <Search />
              </InnerMobileNavBar>
              <Button color={'inherit'} onClick={this.handleDismissMNav}>
                Cancel
              </Button>
            </MobileNavBar>
          )}
      </div>
    );
  }
}

export default Header;
