package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc19Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc19.class);
        Abc19 abc191 = new Abc19();
        abc191.setId(1L);
        Abc19 abc192 = new Abc19();
        abc192.setId(abc191.getId());
        assertThat(abc191).isEqualTo(abc192);
        abc192.setId(2L);
        assertThat(abc191).isNotEqualTo(abc192);
        abc191.setId(null);
        assertThat(abc191).isNotEqualTo(abc192);
    }
}
